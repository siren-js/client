import { Action, EmbeddedEntity, EmbeddedLink, Entity, Field, Link } from '../src';

export const baseUrl = 'https://api.example.com';

export const selfLink = new Link();
selfLink.rel = ['self'];
selfLink.href = `${baseUrl}/people/69420`;

export const upLink = new Link();
upLink.rel = ['up', 'collection'];
upLink.href = `${baseUrl}/people`;

export const knowsLink = new Link();
knowsLink.rel = ['https://schema.org/knows'];
knowsLink.href = `${baseUrl}/people/69421`;
knowsLink.class = ['person'];
knowsLink.title = 'Harry Potter';

export const nameField = new Field<string>();
nameField.name = 'name';
nameField.title = 'Name';
nameField.required = true;
nameField.placeholder = "What's your name?";

export const emailField = new Field<string>();
emailField.name = 'email';
emailField.type = 'email';
emailField.title = 'Email';
emailField.required = true;
emailField.placeholder = "What's your email?";

const messageField = new Field<string>();
messageField.name = 'message';
messageField.title = 'Message';
messageField.required = true;
messageField.placeholder = 'What would you like to say?';

export const action = new Action();
action.name = 'send-message';
action.href = `${baseUrl}/people/69420/messages`;
action.method = 'POST';
action.fields = [nameField, emailField, messageField];

export const spouseLink = new Link();
spouseLink.rel = ['self'];
spouseLink.href = `${baseUrl}/people/69422`;

export const embeddedEntity = new EmbeddedEntity();
embeddedEntity.rel = ['https://schema.org/spouse'];
embeddedEntity.class = ['person'];
embeddedEntity.title = 'Hermione Granger';
embeddedEntity.links = [spouseLink];
embeddedEntity.actions = [action];

export const child1EmbeddedLink = new EmbeddedLink();
child1EmbeddedLink.rel = ['https://schema.org/children'];
child1EmbeddedLink.href = `${baseUrl}/people/69423`;
child1EmbeddedLink.class = ['person'];
child1EmbeddedLink.title = 'Rose Granger-Weasley';

export const child2EmbeddedLink = new EmbeddedLink();
child2EmbeddedLink.rel = ['https://schema.org/children'];
child2EmbeddedLink.href = `${baseUrl}/people/69424`;
child2EmbeddedLink.class = ['person'];
child2EmbeddedLink.title = 'Hugo Granger-Weasley';

interface Person {
  givenName: string;
  familyName: string;
  birthDate?: string;
}

export const entity = new Entity<Person>();
entity.class = ['person'];
entity.title = 'Ron Weasley';
entity.properties = {
  givenName: 'Ronald',
  familyName: 'Weasley'
};
entity.links = [selfLink, upLink, knowsLink];
entity.actions = [action];
entity.entities = [embeddedEntity, child1EmbeddedLink, child2EmbeddedLink];

export const siren = JSON.stringify(entity);

export const textFile = new File(['Lorem ipsum'], 'foo.txt', { type: 'text/plain' });
