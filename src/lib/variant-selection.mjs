export function resolveVariantForSelection(variants = [], optionNames = [], selected = {}) {
  if (!Array.isArray(variants) || variants.length === 0) return null;
  if (!Array.isArray(optionNames) || optionNames.length === 0) return variants[0] || null;

  return variants.find((variant) =>
    optionNames.every((option, index) => {
      const optionName = typeof option === 'string' ? option : option?.name;
      if (!optionName) return false;
      return variant?.[`option${index + 1}`] === selected?.[optionName];
    })
  ) || null;
}
