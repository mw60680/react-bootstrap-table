import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

class PriceFilter extends React.Component {
  static propTypes = {
    column: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.filter = this.filter.bind(this);
    this.getValue = this.getValue.bind(this);
  }
  getValue() {
    const pricesChecks = document.getElementsByName('price_filter');
    let checked = [];
    for(let i = 0; i < pricesChecks.length; i++) {
      if(pricesChecks[i].checked) {
        checked.push(pricesChecks[i].value);
      }
    }
    return checked;
  }
  filter() {
    this.props.onFilter(this.getValue());
  }
  render() {
    return [
      <br/>,
      this.props.filterData.map((item) => {
        return (
          <React.Fragment>
            <input type='checkbox' value={item} name='price_filter'/>
            <label>{item}</label>
            <br/>
          </React.Fragment>)
      }),
      <button
        key="submit"
        className="btn btn-warning"
        onClick={ this.filter }
      >
        { `Filter ${this.props.column.text}` }
      </button>

    ];
  }
}

function App() {
  const productsGenerator = (quantity = 5, callback) => {
    if (callback) return Array.from({ length: quantity }, callback);
  
    // if no given callback, retrun default product format.
    return (
      Array.from({ length: quantity }, (value, index) => ({
        id: index,
        name: `Item name ${index}`,
        price: 2100 + index
      }))
    );
  };

  // const products = productsGenerator();
  const [products, setProducts] = useState(productsGenerator());

  const productIds = products.map(item => item.price);

  const filterByPrice = (filterVals, data) => {
    if(filterVals.length > 0) {
      let filteredData = [];
      filterVals.map((item) => {
        filteredData.push(...data.filter(product => product.price.toString() === item));
      })
      return filteredData;
    }
    return data;
  }

  // const updateData = (filterVals) => {
  //   let newData = [];
  //   filterVals.forEach((item, index) => {
  //     newData.push(...products.filter(product => product.price.toString() === item));
  //   });
  //   setProducts(newData);
  // }

  const columns = [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'name',
    text: 'Product Name',
    filter: textFilter()
  }, {
    dataField: 'price',
    text: 'Product Price',
    filter: customFilter({
      type: FILTER_TYPES.MULTISELECT,
      onFilter: filterByPrice,
    }),
    filterRenderer: (onFilter, column) =>
      <PriceFilter onFilter={ onFilter } column={ column } filterData={productIds}/>
  }];

  return <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
}

export default App;