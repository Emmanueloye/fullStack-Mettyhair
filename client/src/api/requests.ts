import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { json } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

type PostInput<T> = {
  url: string;
  data: T;
  redirectTo?: string;
  setToast?: boolean;
  invalidate?: string[];
};

// {
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 60 * 5,
//     },
//   },
// }
export const queryClient = new QueryClient();

export const customFetch = axios.create({
  baseURL: '/api/v1',
});

export const extractFormData = async (request: Request) => {
  const formData = await request.formData();
  return Object.fromEntries(formData);
};

export const extractParams = (request: Request) => {
  return Object.fromEntries([...new URL(request.url).searchParams.entries()]);
};

// url: string, headers?: { xctid: string }
export const getOnlyData = async ({
  url,
  headers,
}: {
  url: string;
  headers?: { cartid: string };
}) => {
  try {
    const resp = await customFetch.get(url, {
      headers: headers,
    });
    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};

export const getData = async ({
  url,
  headers,
}: {
  url: string;
  headers?: { cartid: string };
}) => {
  try {
    const resp = await customFetch.get(url, {
      headers: headers,
    });
    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw json(error?.response?.data);
    }
  }
};

export const postData = async <T>({
  url,
  data,
  redirectTo,
  setToast = false,
  invalidate,
}: PostInput<T>) => {
  try {
    const resp = await customFetch.post(url, data);

    if (invalidate) {
      queryClient.invalidateQueries({ queryKey: invalidate });
    }

    if (setToast) toast.success(resp.data.message);
    if (redirectTo) return redirect(redirectTo);
    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};

export const updateData = async <T>({
  url,
  data,
  redirectTo,
  setToast = false,
  invalidate,
}: {
  url: string;
  data: T;
  redirectTo?: string;
  setToast?: boolean;
  invalidate?: string[];
}) => {
  try {
    const resp = await customFetch.patch(url, data);
    if (invalidate) {
      queryClient.invalidateQueries({ queryKey: invalidate });
    }

    if (setToast) toast.success(resp.data.message);
    if (redirectTo) return redirect(redirectTo);
    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};

export const deleteData = async ({
  url,
  redirectTo,
  invalidate,
}: {
  url: string;
  redirectTo?: string;
  invalidate?: string[];
}) => {
  try {
    const resp = await customFetch.delete(url);
    if (invalidate) {
      queryClient.invalidateQueries({ queryKey: invalidate });
    }
    if (redirectTo) redirect(redirectTo);

    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw json(error?.response?.data);
    }
  }
};
