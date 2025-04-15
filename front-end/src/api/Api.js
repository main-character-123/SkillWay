// Main URL
export const baseURL = `http://localhost:3000/`;

// Users
export const registerAPI = "users/SignUp"; // post
export const loginAPI = "users/signIn"; // post
export const usersAPI = "users"; // get all or by ID -- delete
export const updateUserApi = "users/update-user"; // patch id -- user token required
export const updatePictureApi = "users/update-image"; // patch id -- user token required
export const updatePasswordApi = "users/update-password"; // patch without id -- user token required
export const updateRoleApi = "users/role"; // patch id -- superAdmin token required
export const checkPasswordApi = "users/check-password"; // patch id -- user token required
export const checkAuthApi = "users/check-Auth"; // get -- user token required

// Courses
export const coursesAPI = "courses"; //get -- post -- patch -- del

// Blogs
export const blogsAPI = "blogs"; // same as courses

// Testimonials
export const testimonialsAPI = "testimonials"; // same as courses

// Internships
export const internshipsAPI = "interns";

// tracks
export const tracksAPI = "tracks"; // get all / post id

// CV Routes
export const uploadTemplateAPI = "cv/upload-template"; // post
export const downloadTemplateAPI = "cv/download-template/cv.pdf"; // get /name
export const analyzeCvAPI = "cv/analyze-cv"; // post - file - cv
