const generatedDetails = new Set([
  'Handcrafted in Nigeria with luxury tailoring',
  'Concealed invisible zip closure',
  'Dry clean only',
]);

const generatedFabric = 'Premium Boutique Silk & Cotton';

export function cleanProductDetails(details?: string[]): string[] {
  return (details ?? []).filter((detail) => !generatedDetails.has(detail));
}

export function cleanProductFabric(fabric?: string): string | undefined {
  return fabric === generatedFabric ? undefined : fabric;
}

export function cleanProductDescription(
  description: string | undefined,
  productName: string
): string | undefined {
  const generatedDescriptions = [
    `Exclusive ${productName} from T&D Fashion Trend. Tailored with elegance and premium materials.`,
    `Exclusive ${productName} from T&D Ladies Fashion. Tailored with elegance and premium materials.`,
  ];
  return description && generatedDescriptions.includes(description) ? undefined : description;
}
