# Oddo-hacakthon-2025
## 🧠 Problem Statement: StackIt – A Minimal Q&A Forum Platform

### 📘 Overview  
**StackIt** is a minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It is designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community.

---

### 👤 User Roles

| Role   | Permissions                                                                 |
|--------|------------------------------------------------------------------------------|
| Guest  | View all questions and answers                                               |
| User   | Register, log in, post questions/answers, vote                              |
| Admin  | Moderate content                                                             |

---

### ✅ Core Features (Must-Have)

#### 1. Ask Question  
Users can submit a new question using:
- **Title** – Short and descriptive  
- **Description** – Written using a rich text editor  
- **Tags** – Multi-select input (e.g., `React`, `JWT`)

#### 2. Rich Text Editor Features  
The description editor should support:
- Bold, Italic, Strikethrough  
- Numbered lists, Bullet points  
- Emoji insertion  
- Hyperlink insertion (URL)  
- Image upload  
- Text alignment – Left, Center, Right  

#### 3. Answering Questions  
- Users can post answers to any question  
- Answers can be formatted using the same rich text editor  
- Only logged-in users can post answers  

#### 4. Voting & Accepting Answers  
- Users can upvote or downvote answers  
- Question owners can mark one answer as accepted  

#### 5. Tagging  
- Questions must include relevant tags  

#### 6. Notification System  
A notification icon (🔔) appears in the top navigation bar.  
Users are notified when:
- Someone answers their question  
- Someone comments on their answer  
- Someone mentions them using `@username`  
The icon displays the number of unread notifications, and clicking it opens a dropdown with recent notifications.
