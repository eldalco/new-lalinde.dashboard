type ColumnHeaderLabelProps = {
  lines: string[];
};

/** Compact multiline header to reduce horizontal table width. */
export function ColumnHeaderLabel({ lines }: ColumnHeaderLabelProps) {
  return (
    <span className="inline-flex flex-col text-left leading-tight normal-case">
      {lines.map((line) => (
        <span key={line} className="uppercase">
          {line}
        </span>
      ))}
    </span>
  );
}
