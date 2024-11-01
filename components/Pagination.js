import React from 'react';
import ReactPaginate from 'react-paginate'; 
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'; 

const Pagination = ({ albums = [], photos = [], pageCount, pageClick }) => {
  const whichItem = albums.length > 0 ? albums.length : (photos.length > 0 ? photos.length : 0);

  return (
    <div className="h-[9%] sm:h-1/6 flex items-center">
      {/* <div>{whichItem}</div> */}
      { whichItem === 0 ? 
        <></>
        :  
        <ReactPaginate 
          previousLabel={<HiChevronDoubleLeft />} 
          nextLabel={<HiChevronDoubleRight />}
          breakLabel={"..."}
          breakClassName={"text-xl sm:text-2xl text-white"}
          pageCount={pageCount}            
          onPageChange={pageClick}
          containerClassName={"inline-flex justify-center items-center w-full text-center py-2 sm:py-4"}
          activeClassName={"text-xl :text-2xl text-rose-900 pageActive"}
          previousClassName={"font-bold text-xl sm:text-2xl text-rose-900 w-min mr-2"}
          nextClassName={"font-bold text-xl sm:text-2xl text-rose-900 w-min ml-2"}
          pageClassName={"font-bold text-xl sm:text-2xl text-rose-900 w-12 leading-3"}
          disabledClassName={"disabled"}
        />
      }
    </div>
  );
};

export default Pagination;