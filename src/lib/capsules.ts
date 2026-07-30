export interface CapsuleMetadata {
  signalNumber: string;
  capsuleNumber: string;
  signalSlug: string;
  title?: string;
}

export function capsuleLabel({
  signalNumber,
  capsuleNumber,
}: CapsuleMetadata) {
  return `Capsule ${signalNumber}.${capsuleNumber}`;
}
