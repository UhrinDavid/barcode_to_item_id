import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ScannerView from './components/scanner-view';
import ProductDisplay from './components/product-display';
import Navigation from './components/navigation';
import { fetchProductDetails } from './api/product-lookup';

const App = () => {
    const [product, setProduct] = React.useState(null);

    const handleBarcodeScan = async (barcode) => {
        const productDetails = await fetchProductDetails(barcode);
        setProduct(productDetails);
    };

    return (
        <Router>
            <div>
                <Navigation />
                <Switch>
                    <Route path="/" exact>
                        <ScannerView onScan={handleBarcodeScan} />
                    </Route>
                    <Route path="/product">
                        <ProductDisplay product={product} />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;