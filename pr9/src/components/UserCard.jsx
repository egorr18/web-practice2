export function UserCard({ name, role }) {
  return (
    <article className="user-card">
      <span>{name.slice(0, 1)}</span>
      <div>
        <b>{name}</b>
        <p>{role}</p>
      </div>
    </article>
  );
}
