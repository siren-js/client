import { Action, EmbeddedLink, Entity, Field, Link } from '../src';

const selfLink = new Link();
selfLink.rel = ['self'];
selfLink.href = 'https://api.example.com/people/69420';

const upLink = new Link();
upLink.rel = ['up', 'collection'];
upLink.href = 'https://api.example.com/people';

const knowsLink = new Link();
knowsLink.rel = ['https://schema.org/knows'];
knowsLink.href = 'https://api.example.com/people/69421';
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
action.href = 'https://api.example.com/people/69420/messages';
action.method = 'POST';
action.fields = [nameField, emailField, messageField];

const spouseEmbeddedLink = new EmbeddedLink();
spouseEmbeddedLink.rel = ['https://schema.org/spouse'];
spouseEmbeddedLink.href = 'https://api.example.com/people/69422';
spouseEmbeddedLink.class = ['person'];
spouseEmbeddedLink.title = 'Hermione Granger';

const child1EmbeddedLink = new EmbeddedLink();
child1EmbeddedLink.rel = ['https://schema.org/children'];
child1EmbeddedLink.href = 'https://api.example.com/people/69423';
child1EmbeddedLink.class = ['person'];
child1EmbeddedLink.title = 'Rose Granger-Weasley';

const child2EmbeddedLink = new EmbeddedLink();
child2EmbeddedLink.rel = ['https://schema.org/children'];
child2EmbeddedLink.href = 'https://api.example.com/people/69424';
child2EmbeddedLink.class = ['person'];
child2EmbeddedLink.title = 'Hugo Granger-Weasley';

export const entity = new Entity();
entity.class = ['person'];
entity.title = 'Ron Weasley';
entity.properties = {
  givenName: 'Ronald',
  familyName: 'Weasley'
};
entity.links = [selfLink, upLink, knowsLink];
entity.entities = [spouseEmbeddedLink, child1EmbeddedLink, child2EmbeddedLink];

export const siren = JSON.stringify(entity);

export const textFile = new File(['Lorem ipsum'], 'foo.txt', { type: 'text/plain' });
