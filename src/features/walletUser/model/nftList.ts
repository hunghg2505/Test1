import { DefaultInitialState } from "../../../redux/model";

export interface NftState extends DefaultInitialState {
  nft: Nft | null;
}

export interface Nft {
  collections: Collection[];
  totalCollection: number;
  totalToken: number;
}

export interface Collection {
  address: string;
  contractURI: string;
  name: string;
  symbol: string;
  tokens: Token[];
}

export interface Token {
  owner: string;
  tokenID: string;
  tokenURI: string;
  metadata: TokenMetadata;
}

export interface TokenMetadata {
  animation_url: string;
  attributes: Attribute[];
  description: string;
  external_url: string;
  image: string;
  name: string;
}

export interface Attribute {
  trait_type: string;
  value: string;
}
