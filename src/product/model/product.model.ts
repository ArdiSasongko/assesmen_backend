export class ProductCreate {
  name: string;
  description: string;
  price: number;
}

export class ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
}

export class ProductResponse {
  id?: number;
  owner?: string;
  name?: string;
  description?: string;
  price?: number;
  created_at?: Date;
  updated_at?: Date;
}
