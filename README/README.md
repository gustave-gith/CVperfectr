
# CVperfectr
We're building CVperfectr, a web app that helps students and job seekers tailor their CV to a specific job offer.

## One-Sentence Description
CVperfectr is a web app that helps students and job seekers tailor their CV to a specific job offer by generating an optimized version based on their information and a target job description.

## Target User
Students and job seekers who want to improve their CV for a specific job and increase their chances of being selected.

## Core Features (MoSCoW)

### Must Have
- Input CV and job offer through a simple form
- Generate a tailored CV based on job requirements
- Edit and save the final CV version

### Should Have
- Highlight missing skills from the job offer
- Improve wording and clarity of CV sections

### Could Have
- Export CV as PDF
- Show a match score between CV and job offer

## Data Model

- **CV**
  - originalText
  - editedText
  - createdAt

- **Job Offer**
  - title
  - description
  - companyName

- **Generated CV**
  - content
  - matchScore
  - suggestions (list)

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel

https://www.figma.com/make/KmLZQWqnMPBRQnqG1D0Kgb/CVperfectr-web-app-UI?t=xQsgnVTrRQkDx46N-0
