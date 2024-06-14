export const formatCurrency = (amount: number) => {
  const inRupees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return inRupees.format(amount);
};
