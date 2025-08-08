import { logoutAccount, loginAccount, registerAccount } from '../config/api';

/**
 * Login utility function that handles authentication and user session management
 * 
 * @param email - User's email address
 * @param password - User's password
 * @param navigate - React Router navigate function for redirection
 * @returns Promise resolving to login result with success status and user data
 */
export const performLogin = async (
  email: string,
  password: string,
  navigate?: (path: string) => void
): Promise<{ success: boolean; message?: string; user?: any; errors?: string[] }> => {
  try {
    const data = await loginAccount(email, password);
    console.log("Login response:", data);

    if (data.success) {
      // Store authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate based on user role if navigate function is provided
      if (navigate) {
        setTimeout(() => {
          const userRole = data.user.role;
          if (userRole === "Admin") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }, 500);
      }

      return {
        success: true,
        message: "Login successful! Redirecting...",
        user: data.user
      };
    } else {
      return {
        success: false,
        message: data.errors?.join(", ") || "Login failed",
        errors: data.errors
      };
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Network error occurred"
    };
  }
};

/**
 * Registration utility function that handles user account creation
 * 
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param email - User's email address
 * @param userName - User's chosen username
 * @param phoneNumber - User's phone number
 * @param password - User's password
 * @param confirmPassword - Password confirmation
 * @param onSuccessCallback - Optional callback to execute on successful registration
 * @returns Promise resolving to registration result with success status and messages
 */
export const performRegister = async (
  firstName: string,
  lastName: string,
  email: string,
  userName: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string,
  onSuccessCallback?: () => void
): Promise<{ success: boolean; message?: string; errors?: string[] }> => {
  try {
    const data = await registerAccount(
      firstName,
      lastName,
      email,
      userName,
      phoneNumber,
      password,
      confirmPassword
    );
    
    console.log("Register response:", data);
    
    if (data.success !== false) {
      // Execute success callback if provided
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      
      return {
        success: true,
        message: "Registration successful! Redirecting to login..."
      };
    } else {
      return {
        success: false,
        message: data.errors?.join(", ") || "Register failed",
        errors: data.errors
      };
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Network error occurred. Please try again."
    };
  }
};

/**
 * Logout utility function that handles both server-side and client-side logout
 * Can be used throughout the application for consistent logout behavior
 * 
 * @param navigate - React Router navigate function for redirection
 * @param redirectPath - Optional path to redirect to after logout (defaults to '/login')
 */
export const performLogout = async (
  navigate?: (path: string) => void,
  redirectPath: string = '/login'
): Promise<void> => {
  try {
    // Check if user is logged in before making API call
    const user = localStorage.getItem('user');
    const isLoggedIn = user && user !== 'null';
    
    // Call logout API if user is logged in
    if (isLoggedIn) {
      await logoutAccount();
    }
  } catch (error) {
    console.error('Error during logout API call:', error);
    // Continue with local cleanup even if API call fails
  } finally {
    // Always clear user data from localStorage
    clearAuthData();
    
    // Navigate to specified path if navigate function is provided
    if (navigate) {
      navigate(redirectPath);
    }
  }
};

/**
 * Clear all authentication-related data from localStorage
 * Useful for logout and session cleanup
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user.role');
};

/**
 * Check if user is currently logged in
 * @returns boolean indicating if user is authenticated
 */
export const isUserLoggedIn = (): boolean => {
  const user = localStorage.getItem('user');
  return !!(user && user !== 'null');
};

/**
 * Get current user data from localStorage
 * @returns Parsed user object or null if not logged in
 */
export const getCurrentUser = (): any | null => {
  try {
    const user = localStorage.getItem('user');
    if (user && user !== 'null') {
      return JSON.parse(user);
    }
    return null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if current user has admin role
 * @returns boolean indicating if user is admin
 */
export const isAdmin = (): boolean => {
  const userData = getCurrentUser();
  return userData?.role === 'Admin';
};

/**
 * Get user token from localStorage
 * @returns token string or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Check if user has valid authentication token
 * @returns boolean indicating if token exists
 */
export const hasValidToken = (): boolean => {
  const token = getAuthToken();
  return !!(token && token !== 'null');
};

/**
 * Navigate user based on their role
 * @param userData - User data object
 * @param navigate - Navigation function
 * @param defaultPath - Default path for non-admin users
 */
export const navigateByRole = (
  userData: any,
  navigate: (path: string) => void,
  defaultPath: string = '/home'
): void => {
  if (userData?.role === 'Admin') {
    navigate('/admin');
  } else {
    navigate(defaultPath);
  }
};
