const BASE_URL = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'API request failed');
  }
  return response.json();
}

function getAuthHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function getPortfolio() {
  const response = await fetch(`${BASE_URL}/portfolio`);
  return handleResponse(response);
}

export async function loginAdmin(credentials) {
  const response = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
}

export async function uploadImage(file, token) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  return handleResponse(response);
}

export async function addProject(project, token) {
  const response = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(project)
  });
  return handleResponse(response);
}

export async function deleteProject(projectId, token) {
  const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

export async function updateProfile(profilePayload, token) {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(profilePayload)
  });
  return handleResponse(response);
}

export async function updateSkills(skills, token) {
  const response = await fetch(`${BASE_URL}/skills`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ skills })
  });
  return handleResponse(response);
}
console.log("checking commit");