import Link from "next/link";

interface MetricProps {
  value: string | number;
  title: string;
  href?: string;
}

const Metric = ({
  value,
  title,
  href,
}: MetricProps) => {
  const content = (
    <div className="flex items-center gap-1">
      <p className="text-sm text-gray-400">
        <span className="font-semibold text-white">
          {value}
        </span>{" "}
        {title}
      </p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default Metric;