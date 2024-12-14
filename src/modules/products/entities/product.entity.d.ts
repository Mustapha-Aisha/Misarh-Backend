import { OrderedProductEntity } from 'src/modules/ordered-products/entities/ordered-product.entity';
export declare enum ScentType {
    BASE = "base",
    TOP = "top",
    MIDDLE = "middle",
    EXOTIC = "exotic"
}
export declare enum Variation {
    "12ml" = 12,
    "15ml" = 15,
    "20ml" = 20,
    "30ml" = 30,
    "50ml" = 50,
    "100ml" = 100
}
export declare enum Category {
    STANDARD = "standard",
    CUSTOM = "custom",
    LIMITED = "limited",
    SIGNATURE = "signature"
}
export interface MixDetails {
    basePerfumes: {
        name: string;
        percentage: number;
    }[];
    designerOils: {
        name: string;
        percentage: number;
    }[];
    customBlendRatio: string;
}
export declare class ProductEntity {
    id: string;
    name: string;
    price: string;
    scentDescription: string;
    image_url: string;
    discount: string;
    categoryId: string;
    customerId: string;
    scentType: ScentType;
    variation: Variation;
    notes: string;
    is_deleted: boolean;
    orderedProduct: OrderedProductEntity;
    mixDetails: MixDetails;
    resultingScentProfile: string;
    scentNotes: string[];
    otherCombinations: string[];
}
export interface AIResponse {
}
