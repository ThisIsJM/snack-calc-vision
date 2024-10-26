import Item from "./item";

interface Transaction {
  id: number | undefined;
  grand_total: number;
  created_at: Date | undefined;
  item_list: Item[];
}

export default Transaction;
