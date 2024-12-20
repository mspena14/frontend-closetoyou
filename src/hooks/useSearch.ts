import { useState } from 'react';
import { Contact } from './../interfaces/IContact';

export const useSearch = (contacts: Contact[]) => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(text.toLowerCase()) ||
        contact.phone.includes(text)
      );
      setFilteredContacts(filtered);
    }
  };

  return { searchText, filteredContacts, handleSearch };
};
