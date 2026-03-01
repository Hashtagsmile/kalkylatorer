# Push to GitHub – Snabbguide

Git är initierat och första commit är gjord. Följ dessa steg för att skapa ett repo och pusha:

---

## 1. Skapa ett nytt repository på GitHub

1. Gå till **https://github.com/new**
2. **Repository name:** t.ex. `kalkylatorer` eller `passiv-inkomst`
3. **Description:** (valfritt) "Gratis ekonomikalkylatorer för sparande, pension, bolån och mer"
4. Välj **Public**
5. **Skapa INTE** README, .gitignore eller license – vi har redan filer lokalt
6. Klicka **Create repository**

---

## 2. Koppla och pusha

Kör dessa kommandon i terminalen (ersätt `DITT_ANVÄNDARNAMN` och `REPO_NAMN` med dina värden):

```bash
cd "c:\Users\olive\OneDrive\Desktop\MORTAGE_CALCULATOR\passiv-inkomst"

git remote add origin https://github.com/DITT_ANVÄNDARNAMN/REPO_NAMN.git
git branch -M main
git push -u origin main
```

**Exempel** (om du heter `johndoe` och repot heter `kalkylatorer`):

```bash
git remote add origin https://github.com/johndoe/kalkylatorer.git
git branch -M main
git push -u origin main
```

---

## 3. SSH istället för HTTPS (valfritt)

Om du använder SSH-nycklar:

```bash
git remote add origin git@github.com:DITT_ANVÄNDARNAMN/REPO_NAMN.git
git branch -M main
git push -u origin main
```

---

Klart. Repot finns nu på GitHub.
