import Item from "./item";

interface Transaction {
  grand_total: number;
  item_list: Item[];
}

export default Transaction;
