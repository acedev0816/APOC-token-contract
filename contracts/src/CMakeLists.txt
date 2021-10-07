project(apoc.token)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( apoc.token apoc.token apoc.token.cpp )
target_include_directories( apoc.token PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( apoc.token ${CMAKE_SOURCE_DIR}/../ricardian )