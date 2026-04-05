export { default as MyButton } from './Button';
export { default as Link } from './Link';
export { default as Skeleton } from './Skeleton';
export { default as Spinner } from './Spinner';

export { AiOutlineDown as ArrowDown, AiOutlineArrowLeft as ArrowLeft, AiOutlineArrowRight as ArrowRight, AiOutlineUp as ArrowUp, AiOutlineDoubleLeft as DoubleArrowLeft, AiOutlineDoubleRight as DoubleArrowRight } from 'react-icons/ai';
export { GiSittingDog as Dog } from 'react-icons/gi';
export { GrServerCluster as Server } from 'react-icons/gr';
export { MdCheckCircle as Check, MdClear as Clear, MdRefresh as Refresh } from "react-icons/md";
export { PiCpu as Cpu, PiMinus as Minus, PiNotePencil as Pencil, PiPlus as Plus } from "react-icons/pi";
export { RiArrowGoBackFill as BackButton } from "react-icons/ri";
export { VscCopy as Copy } from 'react-icons/vsc';

export const dateOptions = {
  day: 'numeric',
  weekday: 'short',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric', hour12: true
} as const