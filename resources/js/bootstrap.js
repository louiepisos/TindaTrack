// Import axios library para sa HTTP requests
import axios from 'axios'
// Make axios available globally sa browser (window.axios)
window.axios = axios
// Set default header para sa AJAX requests - ginagamit ng Laravel para ma-verify na AJAX ang request
// Ito ay protection laban sa CSRF attacks
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
