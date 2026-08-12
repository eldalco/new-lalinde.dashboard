export const apartmentKeys = {
  all: ["apartments"] as const,
  lists: () => [...apartmentKeys.all, "list"] as const,
  list: () => [...apartmentKeys.lists()] as const,
};
