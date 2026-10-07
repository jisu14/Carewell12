// Mock AI Service Layer for Heera

export interface HeeraRequest {
  query: string;
  context?: Record<string, any>;
}

export interface HeeraResponse {
  text: string;
  action?: {
    type: 'navigate' | 'filter' | 'summarize' | 'cart';
    payload: any;
  };
}

class HeeraService {
  /**
   * Process a request using Heera AI.
   * Safety rules are enforced here. Heera will NOT diagnose or prescribe autonomously.
   */
  async process(request: HeeraRequest, patientContext?: string): Promise<HeeraResponse> {
    const query = request.query.toLowerCase();
    
    // Safety guardrails
    if (query.includes('what disease') || query.includes('diagnose') || query.includes('my symptoms')) {
      return {
        text: 'I can help you find a qualified doctor, but I cannot provide medical diagnoses or autonomous clinical decisions. Would you like me to help you book a consultation with a General Physician?',
        action: { type: 'navigate', payload: '/doctors' }
      };
    }

    if (query.includes('prescribe') || query.includes('which medicine')) {
      return {
        text: 'I cannot prescribe medicines or alter existing prescriptions. Please consult a doctor for medical advice. I can help you book an appointment if you need one.',
        action: { type: 'navigate', payload: '/doctors' }
      };
    }

    // Capability routing based on simple mock logic
    if (query.includes('nurse') && query.includes('father')) {
      return {
        text: 'I can help you find a nurse for your father. I have filtered the Home Care providers to show Nursing services.',
        action: { type: 'navigate', payload: '/home-care' }
      };
    }

    if (query.includes('upcoming care') && query.includes('father')) {
      return {
        text: "Here is your father's upcoming care schedule. I've switched your My Care dashboard context to him.",
        action: { type: 'navigate', payload: '/care' }
      };
    }

    if (query.includes('summarize') && query.includes('report')) {
      return {
        text: "I found 3 recent lab reports. Overall, the Lipid Profile and HbA1c indicate stable levels as per the doctor's notes. I have pulled up your Health Records for you to review.",
        action: { type: 'navigate', payload: '/health-records' }
      };
    }

    if (query.includes('cardiologist')) {
      return {
        text: "I've pulled up a list of available Cardiologists. You can filter by consultation fee and availability.",
        action: { type: 'navigate', payload: '/doctors' } // Ideally with a search param
      };
    }

    if (query.includes('prescription') && query.includes('prepare')) {
      return {
        text: 'I have analyzed your recent authorized prescription from Dr. Rajesh Menon and prepared a medicine cart for you to review.',
        action: { type: 'navigate', payload: '/prescription-cart/hr1' }
      };
    }

    if (query.includes('next appointment')) {
      return {
        text: 'Your next appointment is with Dr. Rajesh Menon on Oct 9 at 4:30 PM for a Cardiology consultation. I can set a reminder for you if you like.',
        action: { type: 'navigate', payload: '/care' }
      };
    }

    // Default fallback
    return {
      text: "I'm Heera, your care ecosystem assistant. I can help you navigate services, summarize your authorized health records, or coordinate care. How can I assist you today?"
    };
  }
}

export const heeraService = new HeeraService();
