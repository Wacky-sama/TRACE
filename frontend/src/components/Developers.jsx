const developers = [
  {
    name: "Balgos, Wendel B.",
    email: "balgoswendel196@gmail.com",
  },
  {
    name: "Salviejo, Victor Louis R.",
    email: "louieBoySalviejo06@gmail.com",
  },
  {
    name: "Taguba, Philip Joshua V.",
    email: "tagubaphilipjoshuav@gmail.com",
  },
  {
    name: 'Tabugadir, Kenji "Brocks" I.',
    email: "tabugadirkenjibrocks@gmail.com",
  },
];

const Developers = () => {
  return (
    <div className="space-y-1">
      {developers.map((dev, index) => (
        <p key={index}>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${dev.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {dev.name}
          </a>
        </p>
      ))}
    </div>
  );
};

export default Developers;
