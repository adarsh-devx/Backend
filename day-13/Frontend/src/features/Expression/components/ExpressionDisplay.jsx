function ExpressionDisplay({ expression }) {
  return (
    <div>
      <h2>
        {expression.emoji} {expression.name}
      </h2>
    </div>
  );
}

export default ExpressionDisplay;