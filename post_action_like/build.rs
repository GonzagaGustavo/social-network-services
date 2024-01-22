fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::compile_protos("proto/service.proto")?;
    tonic_build::configure()
        .out_dir("proto")
        .compile(&["proto/service.proto"], &["proto"])
        .unwrap();

    Ok(())
}
