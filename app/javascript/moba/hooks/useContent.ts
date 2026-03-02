import { useContent as superglueUseContent } from "@thoughtbot/superglue";

export function useContent<T>(): T {
  return superglueUseContent<T>();
}
