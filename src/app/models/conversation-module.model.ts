export interface ConversationStep {
  id: string;
  prompt: string;
  translation?: string;
  expected: {
    answers: string[];
    alternatives?: string[];
  };
  feedback?: {
    correct?: string;
    incorrect?: string;
  };
}

export interface ConversationModule {
  id: string;
  title: string;
  description?: string;
  steps: ConversationStep[];
}
