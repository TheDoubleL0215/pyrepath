export type Lead = {
  Id: number;
  CreatedAt: string; // You could use `Date` if you parse it
  UpdatedAt: string;
  Company: string;
  Adress: string;
  Phone: string;
  Website: string;
  Status: string | null;
  Note: string | null
};
