export function isPublishedSignalData(data: { status: "draft" | "published" }) {
  return data.status === "published";
}
