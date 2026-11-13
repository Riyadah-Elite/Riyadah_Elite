import * as ImagePicker from 'expo-image-picker';

const ALLOWED_MIME = ['image/jpeg', 'image/png'];

export interface PickedAvatar {
  uri: string;
  mimeType: string;
  fileName: string;
  file?: File;
}

function normaliseMime(asset: ImagePicker.ImagePickerAsset): string {
  const declared = asset.mimeType ?? asset.file?.type;
  if (declared && ALLOWED_MIME.includes(declared)) return declared;

  const lower = (asset.fileName ?? asset.uri).toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';

  return declared ?? 'image/jpeg';
}

function normaliseName(asset: ImagePicker.ImagePickerAsset, mimeType: string): string {
  const fallback = mimeType === 'image/png' ? 'avatar.png' : 'avatar.jpg';
  const candidate = asset.fileName ?? asset.file?.name;

  if (!candidate) return fallback;

  const lower = candidate.toLowerCase();
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return candidate;
  }

  return fallback;
}

/**
 * Opens the native library (or the browser file dialog on web). The backend
 * accepts only JPG/PNG under 5 MB, so the picker is constrained and the
 * returned asset is normalised before it reaches FormData.
 */
export async function pickAvatar(): Promise<PickedAvatar | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Photo library access is needed to choose an avatar.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  const mimeType = normaliseMime(asset);

  if (!ALLOWED_MIME.includes(mimeType)) {
    throw new Error('Choose a JPG or PNG image for your avatar.');
  }

  if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
    throw new Error('That image is larger than 5 MB. Pick a smaller one.');
  }

  return {
    uri: asset.uri,
    mimeType,
    fileName: normaliseName(asset, mimeType),
    file: asset.file,
  };
}

/**
 * General purpose image picker (banner, screenshots, etc) without strict 1:1 aspect lock.
 */
export async function pickImage(): Promise<PickedAvatar | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Photo library access is needed to select an image.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  const mimeType = normaliseMime(asset);

  if (!ALLOWED_MIME.includes(mimeType)) {
    throw new Error('Choose a JPG or PNG image.');
  }

  if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
    throw new Error('That image is larger than 5 MB. Pick a smaller one.');
  }

  return {
    uri: asset.uri,
    mimeType,
    fileName: normaliseName(asset, mimeType),
    file: asset.file,
  };
}

export interface RegistrationPayload {
  username: string;
  email: string;
  password: string;
  avatar: PickedAvatar;
  role?: 'USER' | 'DEVELOPER' | 'ORG';
}

/**
 * The register endpoint is multipart/form-data because of the avatar field.
 * Web already has a real File; native needs the `{ uri, name, type }` shape
 * that React Native's FormData understands.
 */
export function buildRegistrationFormData(values: RegistrationPayload): FormData {
  const form = new FormData();

  form.append('username', values.username.trim());
  form.append('email', values.email.trim().toLowerCase());
  form.append('password', values.password);

  if (values.role) {
    form.append('role', values.role);
  }

  if (values.avatar.file) {
    form.append('avatar', values.avatar.file, values.avatar.fileName);
  } else {
    form.append(
      'avatar',
      {
        uri: values.avatar.uri,
        name: values.avatar.fileName,
        type: values.avatar.mimeType,
      } as unknown as Blob,
    );
  }

  return form;
}
