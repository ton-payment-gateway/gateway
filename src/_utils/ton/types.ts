export interface ITonTransaction {
  hash: string;
  success: boolean;
  in_msg: {
    bounce: boolean;
    bounced: boolean;
    value: number;
    destination: {
      address: string;
      is_scam: false;
    };
    source: {
      address: string;
      is_scam: boolean;
    };
  };
}
