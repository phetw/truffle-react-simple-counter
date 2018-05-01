pragma solidity ^0.4.2;

contract Counter {
    int counter = 0;

    function increment() public{
        counter++;
    }

    function decrement() public {
        counter--;
    }

    function getCoutner() public view returns (int){
        return counter;
    }
}
