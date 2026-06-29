import { memberInitials, type Member } from "../members";

export function MemberAvatar({
  member,
  size = 20,
}: {
  member: Member;
  size?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        backgroundColor: member.color,
        fontSize: size * 0.45,
      }}
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      aria-hidden
    >
      {memberInitials(member.name)}
    </span>
  );
}
