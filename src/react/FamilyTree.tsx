import React, { useMemo } from "react";
import { hierarchy, tree, HierarchyPointNode } from "d3";

export interface Person {
  id: string;
  "first name": string;
  "last name": string;
  birthday?: string;
  children?: Person[];
}

interface FamilyTreeProps {
  data: Person;
  width?: number;
  height?: number;
}

function ageFromBirthday(birthday?: string): string {
  if (!birthday) return "";
  const birth = new Date(birthday);
  const diff = Date.now() - birth.getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return `${age}`;
}

export const FamilyTree: React.FC<FamilyTreeProps> = ({
  data,
  width = 600,
  height = 400,
}) => {
  const layout = useMemo(() => {
    const root = hierarchy<Person>(data, (d) => d.children);
    return tree<Person>().nodeSize([120, 180])(root);
  }, [data]);

  const nodes = layout.descendants() as HierarchyPointNode<Person>[];
  const links = layout.links();

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2},40)`}>
        {links.map((l, i) => (
          <line
            key={i}
            x1={l.source.x}
            y1={l.source.y}
            x2={l.target.x}
            y2={l.target.y}
            stroke="#D30002"
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i} transform={`translate(${n.x},${n.y})`}>
            <circle r={30} fill="#ccc" stroke="#ccc" />
            <text y={45} textAnchor="middle" fontSize="12">
              {`${n.data["first name"]} ${
                n.data["last name"].charAt(0)
              } (${ageFromBirthday(n.data.birthday)})`}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default FamilyTree;

