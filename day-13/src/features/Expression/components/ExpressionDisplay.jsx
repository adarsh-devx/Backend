function ExpressionDisplay({ expression }) {
  return (
    <div>
      <h2>
        {expression.emoji} {expression.name}
      </h2>

      <p>
        Confidence: {expression.confidence}%
      </p>
    </div>
  );
}

export default ExpressionDisplay;