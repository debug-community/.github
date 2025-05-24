import axios from 'axios';
import fs from 'fs';

const ORG = 'debug-community';
const TOKEN = process.env.GH_TOKEN;

async function generateReadme() {
  const members = await axios.get(`https://api.github.com/orgs/${ORG}/members`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  const profileData = await Promise.all(
    members.data.map(async (member) => {
      const user = await axios.get(member.url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      return {
        login: user.data.login,
        avatar_url: user.data.avatar_url,
      };
    })
  );

  const avatars = profileData
  .map(
    (user) =>
      `<a href="https://github.com/${user.login}">
        <img src="${user.avatar_url}" width="60" alt="${user.login}" />
      </a>`
  )
  .join('\n');

  const readmeContent = `## 👥 Organization Members

  ${avatars}
  `;

  fs.writeFileSync('README.md', readmeContent);
}

generateReadme();