import {GameQuestion} from "@/app/game/types";
import { Card } from "@/app/game/components/ui";

interface QuestionCardProps {
  question: GameQuestion;
}

// Fun emojis for different types of questions
const getQuestionEmoji = (question: string): string => {
  const q = question.toLowerCase();
  if (q.includes('animal')) return '🐾';
  if (q.includes('come') || q.includes('boca')) return '🍽️';
  if (q.includes('pies') || q.includes('camina')) return '👣';
  if (q.includes('cielo') || q.includes('sol') || q.includes('luna')) return '🌟';
  if (q.includes('agua') || q.includes('nada')) return '🌊';
  if (q.includes('casa') || q.includes('iluminada')) return '🏠';
  if (q.includes('calor') || q.includes('helado')) return '🍦';
  if (q.includes('ojos') || q.includes('miras')) return '👀';
  if (q.includes('manos') || q.includes('escribes')) return '✍️';
  if (q.includes('duermes') || q.includes('cama')) return '🛏️';
  return '🎯';
};

export function QuestionCard({ question }: QuestionCardProps) {
  const emoji = getQuestionEmoji(question.question);

  return (
    <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 z-1">
      <div className="text-center mb-8">
        <div className="text-6xl mb-6 animate-bounce">{emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <span className="text-3xl mr-3">💭</span>
          Completa la oración:
          <span className="text-3xl ml-3">💭</span>
        </h2>
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-dashed border-purple-300">
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            {question.question}
          </p>
        </div>
      </div>

      {/* Fun decorative elements */}
      <div className="flex justify-center space-x-4 text-2xl opacity-60">
        <span>✨</span>
        <span>🌈</span>
        <span>⭐</span>
        <span>🎈</span>
        <span>✨</span>
      </div>
    </Card>
  );
}
