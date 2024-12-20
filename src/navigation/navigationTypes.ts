import { Contact } from '../interfaces/IContact';
import { Location } from '../interfaces/ILocation';

export type RootStackParamList = {
    ContactList: Contact[] | undefined;

    AddEditContact: {
      contact?: Contact,
      onDelete: (id: string) => void,
      onSave: () => void,
      isLoadedSetter: (isLoaded: boolean) => void
    };

    ContactDetail: {
      contact: Contact ,
      onDelete: (id: string) => void,
      onSave: () => void,
      isLoadedSetter: ( isLoaded: boolean ) => void
    };

    MapScreen: {
      onSelectLocation: (location: { latitude: number; longitude: number }) => void;
      initialLocation?: Location | null | string;
    };

    Register: undefined;
    Login: undefined;

  };
