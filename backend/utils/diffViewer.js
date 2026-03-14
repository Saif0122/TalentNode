/**
 * Simple word-level diffing utility.
 * Returns an array of objects: { value: string, added?: boolean, removed?: boolean }
 */
function diffWords(oldStr, newStr) {
  const oldWords = (oldStr || "").split(/(\s+)/);
  const newWords = (newStr || "").split(/(\s+)/);

  const matrix = Array(oldWords.length + 1)
    .fill(null)
    .map(() => Array(newWords.length + 1).fill(0));

  for (let i = 1; i <= oldWords.length; i++) {
    for (let j = 1; j <= newWords.length; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const result = [];
  let i = oldWords.length;
  let j = newWords.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      result.unshift({ value: oldWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      result.unshift({ value: newWords[j - 1], added: true });
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      result.unshift({ value: oldWords[i - 1], removed: true });
      i--;
    }
  }

  return result;
}

/**
 * Compare two sets of skills.
 */
function compareSkills(oldSkills, newSkills) {
  const oldSet = new Set(oldSkills || []);
  const newSet = new Set(newSkills || []);

  const added = [...newSet].filter(x => !oldSet.has(x));
  const removed = [...oldSet].filter(x => !newSet.has(x));
  const unchanged = [...newSet].filter(x => oldSet.has(x));

  return { added, removed, unchanged };
}

/**
 * Compare two sets of experience timeline items.
 * Matches based on company and role for simplicity.
 */
function compareExperience(oldExp, newExp) {
  const oldItems = oldExp || [];
  const newItems = newExp || [];

  const result = [];
  const processedNewIndices = new Set();

  oldItems.forEach(oldItem => {
    const matchingNewIndex = newItems.findIndex((newItem, idx) => 
      !processedNewIndices.has(idx) && 
      newItem.company === oldItem.company && 
      newItem.role === oldItem.role
    );

    if (matchingNewIndex !== -1) {
      const newItem = newItems[matchingNewIndex];
      processedNewIndices.add(matchingNewIndex);
      
      // Compare description
      const descDiff = diffWords(oldItem.description, newItem.description);
      const isChanged = descDiff.some(d => d.added || d.removed);

      result.push({
        type: 'unchanged',
        company: oldItem.company,
        role: oldItem.role,
        duration: newItem.duration,
        description: descDiff,
        isChanged
      });
    } else {
      result.push({
        type: 'removed',
        ...oldItem
      });
    }
  });

  newItems.forEach((newItem, idx) => {
    if (!processedNewIndices.has(idx)) {
      result.push({
        type: 'added',
        ...newItem
      });
    }
  });

  return result;
}

module.exports = {
  diffWords,
  compareSkills,
  compareExperience
};
