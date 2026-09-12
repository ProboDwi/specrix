import { formatPriceShort, formatPrice } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  short?: boolean;
  className?: string;
}

export default function PriceTag({ price, short = false, className = "" }: PriceTagProps) {
  return (
    <span className={`font-bold price-text ${className}`} title={formatPrice(price)}>
      {short ? formatPriceShort(price) : formatPrice(price)}
    </span>
  );
}
