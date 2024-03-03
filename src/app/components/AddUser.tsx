'use client'
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import "../globals.scss";

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function assignSecretSantas(participants: { name: string; email: string }[]): { santa: { name: string; email: string }; recipient: { name: string; email: string } }[] {
  const shuffledParticipants = shuffleArray(participants);
  const santas = [...shuffledParticipants];
  const recipients = [...shuffledParticipants];

  while (true) {
    let validAssignment = true;
    for (let i = 0; i < participants.length; i++) {
      if (santas[i].email === recipients[i].email) {
        validAssignment = false;
        break;
      }
    }
    if (validAssignment) {
      break;
    }
    shuffleArray(recipients);
  }

  const assignments: { santa: { name: string; email: string }; recipient: { name: string; email: string } }[] = [];
  for (let i = 0; i < participants.length; i++) {
    assignments.push({ santa: santas[i], recipient: recipients[i] });
  }

  return assignments;
}

const AddUser: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [participants, setParticipants] = useState<{ name: string; email: string }[]>([]);
  const [assignments, setAssignments] = useState<{ santa: { name: string; email: string }; recipient: { name: string; email: string } }[]>([]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isDuplicate = participants.some(participant => participant.email === email);

    if (isDuplicate) {
      window.alert('This email is already entered.');
      return;
    }

    setParticipants([...participants, { name, email }]);
    setName('');
    setEmail('');
  };

  const handleAssignSantas = () => {
    if (participants.length < 3) {
      window.alert('You need at least 3 players.');
      return;
    }
    const secretSantaAssignments = assignSecretSantas(participants);
    setAssignments(secretSantaAssignments);
    sendEmails(secretSantaAssignments);
  };

  const sendEmails = (assignments: { santa: { name: string; email: string }; recipient: { name: string; email: string } }[]) => {
    assignments.forEach((assignment) => {
      const templateParams = {
        to_email: assignment.santa.email,
        from_name: name,
        recipient_name: assignment.recipient.name,
        reply_to: name,
      };
      emailjs.send('YOUR-SERVICE-ID', 'YOUR-TEMPLATE-ID', templateParams, 'YOUR-ACCOUNT-ID')
        .then((response) => {
          console.log('Email sent successfully!', response);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
        });
    });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="mb-4 form__contact">
        <h1>Secret Santa</h1>
        <fieldset>
          <label className="block mb-4 text-xl font-bold text-red-800">
            <span>Name:</span>
            <input
              type="text"
              value={name}
              required
              onChange={handleNameChange}
              className="form__field"
              data-placeholder="Enter your name"
            />
          </label>
          <label className="block mb-4 text-xl font-bold text-red-800">
            <span>Email:</span>
            <input
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              className="form__field"
              data-placeholder="Enter your email"
            />
          </label>
          <button type="submit">Join Secret Santa</button>
        </fieldset>
        <button onClick={handleAssignSantas} className="bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-900 mb-4 transition duration-300 ease-in-out">
        Assign Secret Santas
      </button>
      </form>
    </div>

  );
};

export default AddUser;
