import styles from './styles.module.css';
import noData from '@/public/no-data.jpg';
import Image from 'next/image';

const NoData = ({ text, btnFn, btnTxt }: { text: string, btnTxt: string, btnFn: (() => void) | undefined }) => {

    return (
        <div className={styles.noData}>
            <div className={styles.noData_img}>
                <Image src={noData} alt='no-data' />
            </div>
            <h3>{text}</h3>
            {btnFn && <button className={`${styles.ep_btn} pointer`} onClick={() => btnFn()}>
                {btnTxt || 'Retry'}
            </button>}
        </div>
    )
};

export default NoData;