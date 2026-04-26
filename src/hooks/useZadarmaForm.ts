import { useState, useEffect } from 'react';

export interface ZadarmaFormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  messengerValue: string;
  country: string;
  website: string;
  message: string;
}

export interface ZadarmaFormTypes {
  emailType: string;
  phoneType: string;
  messengerType: string;
}

export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

export const useZadarmaForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [utmParams, setUtmParams] = useState<UtmParams | null>(null);

  // Extract UTM parameters from URL on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || 'organic';
    const utm_medium = urlParams.get('utm_medium') || 'none';
    const utm_campaign = urlParams.get('utm_campaign') || 'none';

    setUtmParams({
      utm_source,
      utm_medium,
      utm_campaign
    });
  }, []);

  const submitToZadarma = async (formData: ZadarmaFormData, formTypes: ZadarmaFormTypes) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof ZadarmaFormData].trim());

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Prepare Zadarma lead data
      const leadData = {
        lead: {
          name: formData.name.trim(),
          contacts: [
            {
              value: formData.email.trim(),
              type: formTypes.emailType
            }
          ],
          phones: [
            {
              phone: formData.phone.trim(),
              type: formTypes.phoneType
            }
          ],
          lead_source: 'form',
          ...(formData.status && { status: formData.status }),
          ...(formData.country && { country: formData.country }),
          ...(formData.website && { website: formData.website.trim() }),
        },
        ...(utmParams && { utms: utmParams })
      };

      // Add messenger contact if provided
      if (formData.messengerValue.trim()) {
        leadData.lead.contacts.push({
          value: formData.messengerValue.trim(),
          type: formTypes.messengerType
        });
      }

      console.log('Submitting lead to Zadarma:', leadData);

      // Submit to Zadarma API
      const response = await fetch('/api/zadarma/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Zadarma API response:', result);

      // If message is provided, send as timeline note after lead creation
      if (formData.message.trim() && result.leadId) {
        try {
          await fetch('/api/zadarma/feed', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              leadId: result.leadId,
              content: formData.message.trim()
            })
          });
        } catch (feedError) {
          console.warn('Failed to add timeline note:', feedError);
          // Don't fail the whole submission if timeline note fails
        }
      }

      setSubmitMessage('Thank you! Your message has been sent successfully.');
      return { success: true, data: result };

    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitMessage(`Sorry, there was an error: ${errorMessage}. Please try again.`);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessage = () => {
    setSubmitMessage('');
  };

  return {
    isSubmitting,
    submitMessage,
    utmParams,
    submitToZadarma,
    clearMessage
  };
};