# MedLink - Healthcare Data Platform Frontend

A modern, responsive React application built with TypeScript, Tailwind CSS, and Framer Motion. This frontend provides a comprehensive healthcare data management interface with role-based access control.

## 🚀 Features

### **Core Functionality**
- **Bilingual Support**: English and Nepali (नेपाली) language support
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Role-Based Access**: Admin and User portals with different permissions
- **Authentication System**: Secure login with demo accounts

### **Authentication & Security**
- **Default Accounts**:
  - Admin: `admin` / `admin` → Redirects to `/admin`
  - User: `user` / `user` → Redirects to `/user`
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent login state
- **Secure Logout**: Proper session cleanup

### **User Experience**
- **Smooth Animations**: Framer Motion for engaging interactions
- **Loading States**: Visual feedback during authentication
- **Error Handling**: User-friendly error messages
- **Click-Outside Handlers**: Improved dropdown interactions

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Internationalization**: React i18next
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation with user menu
│   ├── Hero.tsx        # Landing page hero section
│   ├── About.tsx       # About section
│   ├── Features.tsx    # Features showcase
│   ├── HowItWorks.tsx  # Process explanation
│   ├── Contact.tsx     # Contact form
│   ├── Footer.tsx      # Footer component
│   ├── AuthPage.tsx    # Login/Signup page
│   ├── AdminPage.tsx   # Admin dashboard
│   ├── UserPage.tsx    # User dashboard
│   ├── ThemeToggle.tsx # Theme switcher
│   └── LanguageSwitcher.tsx # Language switcher
├── contexts/           # React contexts
│   ├── ThemeContext.tsx    # Theme management
│   ├── LanguageContext.tsx # Language management
│   └── AuthContext.tsx     # Authentication state
├── locales/            # Translation files
│   ├── en.json        # English translations
│   └── np.json        # Nepali translations
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── i18n.ts            # Internationalization setup
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 16+ 
- npm 8+

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Build for Production**
```bash
npm run build
```

## 🔐 Authentication Flow

1. **Visit** `/auth` to access the login page
2. **Use Demo Accounts**:
   - Click "Demo Accounts Available" to reveal credentials
   - Click on credentials to auto-fill the form
3. **Login** with either account type
4. **Automatic Redirect** based on user role:
   - Admin → `/admin` dashboard
   - User → `/user` dashboard

## 🌐 Language Support

### **Available Languages**
- **English (en)**: Default language
- **Nepali (np)**: नेपाली भाषा

### **Language Switching**
- Use the language switcher in the header
- Language preference is saved in localStorage
- All UI text automatically updates

## 🎨 Theme System

### **Available Themes**
- **Light Mode**: Clean, professional appearance
- **Dark Mode**: Easy on the eyes, modern aesthetic

### **Theme Features**
- Automatic theme detection
- Persistent theme preference
- Smooth transitions between themes
- Optimized color schemes for both modes

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Responsive across all screen sizes
- **Touch Friendly**: Optimized for touch interactions
- **Accessibility**: WCAG compliant design patterns

## 🔒 Security Features

- **Protected Routes**: Role-based access control
- **Session Validation**: Automatic route protection
- **Secure Storage**: localStorage for session persistence
- **Input Validation**: Form validation and sanitization

## 🎯 User Roles

### **Admin Role**
- Access to `/admin` dashboard
- System management tools
- User management capabilities
- System health monitoring
- Data analytics access

### **User Role**
- Access to `/user` dashboard
- Personal health records
- Appointment management
- Prescription access
- Quick action tools

## 🚧 Future Enhancements

- **Backend Integration**: API endpoints for real data
- **HIPAA Compliance**: Enhanced security measures
- **ISO 27001**: Information security management
- **Advanced Features**: 
  - User registration
  - Password reset
  - Email verification
  - Social login
  - Advanced role permissions

## 🐛 Troubleshooting

### **Common Issues**
1. **Authentication Errors**: Ensure demo credentials are correct
2. **Route Access**: Check user role and authentication status
3. **Language Issues**: Clear localStorage and refresh page
4. **Theme Problems**: Reset theme preference in localStorage

### **Development Issues**
1. **Build Errors**: Clear node_modules and reinstall
2. **TypeScript Errors**: Check type definitions
3. **Styling Issues**: Verify Tailwind CSS configuration

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team.

---

**Note**: This is a frontend-only implementation. Backend services and HIPAA/ISO 27001 compliance features will be implemented in future phases.
