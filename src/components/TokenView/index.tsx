import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

interface TokenProps {
  label: string;
  token: string;
}

const TokenView: React.FC<TokenProps> = ({ label, token }) => {
  const copyToClipboard = (clipboardText: string) => {
    navigator.clipboard.writeText(clipboardText);

    toast.success(`Copied to clipboard successfully.`, {
      position: `bottom-right`,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <div className="my-4 flex flex-row items-center space-x-4">
        <span className="text-base font-medium"> {label}: </span>

        <div className="flex h-full flex-row items-center rounded-lg bg-slate-100 py-2 pl-3 pr-1">
          <p className="w-[300px] break-all">{token}</p>
          <div
            className="ml-3 flex h-full items-center rounded-md hover:cursor-pointer hover:bg-slate-300"
            onClick={() => copyToClipboard(token)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default TokenView;
